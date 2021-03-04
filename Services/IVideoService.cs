using System.Collections.Generic;
using System.Threading.Tasks;
using IEvangelist.VideoChat.Models;

namespace IEvangelist.VideoChat.Services
{
    public interface IVideoService
    {
        string GetTwilioJwt(string identity);

        Task<IEnumerable<RoomDetails>> GetAllRoomsAsync();
    }
}