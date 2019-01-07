using System.Collections.Generic;
using System.Threading.Tasks;
using IEvangelist.VideoChat.Models;

namespace IEvangelist.VideoChat.Abstractions
{
    public interface IVideoService
    {
        string GetTwilioJwt(string identity, string roomName);

        Task<IEnumerable<RoomDetails>> GetAllRoomsAsync();
    }
}