using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IEvangelist.VideoChat.Abstractions;
using IEvangelist.VideoChat.Models;
using IEvangelist.VideoChat.Options;
using Twilio;
using Twilio.Base;
using Twilio.Jwt.AccessToken;
using Twilio.Rest.Video.V1;
using Twilio.Rest.Video.V1.Room;
using ParticipantStatus = Twilio.Rest.Video.V1.Room.ParticipantResource.StatusEnum;

namespace IEvangelist.VideoChat.Services
{
    public class VideoService : IVideoService
    {
        readonly TwilioSettings _twilioSettings;

        public VideoService(Microsoft.Extensions.Options.IOptions<TwilioSettings> twilioOptions)
        {
            _twilioSettings =
                twilioOptions?.Value
             ?? throw new ArgumentNullException(nameof(twilioOptions));

            TwilioClient.Init(_twilioSettings.ApiKey, _twilioSettings.ApiSecret);
        }

        public string GetTwilioJwt(string identity)
            => new Token(_twilioSettings.AccountSid,
                         _twilioSettings.ApiKey,
                         _twilioSettings.ApiSecret,
                         identity ?? GetName(),
                         grants: new HashSet<IGrant> { new VideoGrant() }).ToJwt();

        public async Task<IEnumerable<RoomDetails>> GetAllRoomsAsync()
        {
            var rooms = await RoomResource.ReadAsync();
            var tasks = rooms.Select(
                room => GetRoomDetailsAsync(
                    room,
                    ParticipantResource.ReadAsync(
                        room.Sid,
                        ParticipantStatus.Connected)));

            return await Task.WhenAll(tasks);

            static async Task<RoomDetails> GetRoomDetailsAsync(
                RoomResource room,
                Task<ResourceSet<ParticipantResource>> participantTask)
            {
                var participants = await participantTask;
                return new RoomDetails
                {
                    Name = room.UniqueName,
                    MaxParticipants = room.MaxParticipants ?? 0,
                    ParticipantCount = participants.ToList().Count
                };
            }
        }

        #region Borrowed from https://github.com/twilio/video-quickstart-js/blob/1.x/server/randomname.js

        readonly string[] _adjectives =
        {
            "Abrasive", "Brash", "Callous", "Daft", "Eccentric", "Feisty", "Golden",
            "Holy", "Ignominious", "Luscious", "Mushy", "Nasty",
            "OldSchool", "Pompous", "Quiet", "Rowdy", "Sneaky", "Tawdry",
            "Unique", "Vivacious", "Wicked", "Xenophobic", "Yawning", "Zesty"
        };

        readonly string[] _firstNames =
        {
            "Anna", "Bobby", "Cameron", "Danny", "Emmett", "Frida", "Gracie", "Hannah",
            "Isaac", "Jenova", "Kendra", "Lando", "Mufasa", "Nate", "Owen", "Penny",
            "Quincy", "Roddy", "Samantha", "Tammy", "Ulysses", "Victoria", "Wendy",
            "Xander", "Yolanda", "Zelda"
        };

        readonly string[] _lastNames =
        {
            "Anchorage", "Berlin", "Cucamonga", "Davenport", "Essex", "Fresno",
            "Gunsight", "Hanover", "Indianapolis", "Jamestown", "Kane", "Liberty",
            "Minneapolis", "Nevis", "Oakland", "Portland", "Quantico", "Raleigh",
            "SaintPaul", "Tulsa", "Utica", "Vail", "Warsaw", "XiaoJin", "Yale",
            "Zimmerman"
        };

        string GetName() => $"{_adjectives.RandomElement()} {_firstNames.RandomElement()} {_lastNames.RandomElement()}";

        #endregion
    }

    static class StringArrayExtensions
    {
        static readonly Random Random = new Random((int)DateTime.Now.Ticks);

        internal static string RandomElement(this IReadOnlyList<string> array) 
            => array[Random.Next(array.Count)];
    }
}