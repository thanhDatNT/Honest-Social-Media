using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Posts.Queries.GetPersonalPosts;
using AutoMapper;
using Domain.Common.Errors;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Photos.Queries.GetPhotoByUserQuery
{
    public record GetPhotoByUserQuery(int UserId, int Offset = 0, int Limit = 100) : IRequest<PhotoVm>;

    public class GetPhotoByUserQueryHandler : IRequestHandler<GetPhotoByUserQuery, PhotoVm>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPhotoByUserQueryHandler(IApplicationDbContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }
        public async Task<PhotoVm> Handle(GetPhotoByUserQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _context.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
                if (user == null) throw new NotFoundException(nameof(User), request.UserId);

                List<Photo> photos = await _context.Photo.Where(ph => ph.UserId == user.Id).OrderByDescending(ph => ph.CreatedAt).Skip(request.Offset).Take(request.Limit).ToListAsync();
                List<PhotoDto> photosDto = _mapper.Map<List<PhotoDto>>(photos);
                bool hasNextPage = await _context.Photo.CountAsync(ph => ph.User.Id == request.UserId) > request.Offset + request.Limit;

                return new PhotoVm()
                {
                    Photos = photosDto,
                    TotalCount = photosDto.Count,
                    HasNextPage = hasNextPage
                };
            }
            catch (Exception e) 
            {
                throw;
            }
        }
    }
}
