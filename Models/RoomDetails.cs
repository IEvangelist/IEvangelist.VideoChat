namespace IEvangelist.VideoChat.Models
{
    public class RoomDetails
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public int ParticipantCount { get; set; }

        public int MaxParticipants { get; set; }
    }
}