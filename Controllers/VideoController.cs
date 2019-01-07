using System.Threading.Tasks;
using IEvangelist.VideoChat.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace IEvangelist.VideoChat.Controllers
{
    [Route("api/video")]
    public class VideoController : Controller
    {
        readonly IVideoService _videoService;

        public VideoController(IVideoService videoService) 
            => _videoService = videoService;

        [HttpGet("token/{roomName?}")]
        public IActionResult GetToken(string roomName)
            => Json(new { token = _videoService.GetTwilioJwt(User.Identity.Name ?? "guest", roomName) });

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms() 
            => Json(await _videoService.GetAllRoomsAsync());
    }
}