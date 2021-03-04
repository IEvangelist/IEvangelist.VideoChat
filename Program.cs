using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using IEvangelist.VideoChat;

await WebHost.CreateDefaultBuilder(args)
    .UseStartup<Startup>()
    .Build()
    .RunAsync();