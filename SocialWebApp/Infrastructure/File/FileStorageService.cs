using Application.Common.Interfaces;
using Application.Common.Models;
using Azure.Core;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.File
{
    public class FileStorageService : IFileStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;

        public FileStorageService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task<string> UploadAsync(FileDto file,string path="/user/photos")
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient("public-uploads");

            var blobClient = containerClient.GetBlobClient(file.GetPathWithFileName(path));
            await blobClient.UploadAsync(file.Content, new BlobHttpHeaders { ContentType = file.ContentType });

            var url = blobClient.Uri.ToString();

            return url;
        }
    }
}
