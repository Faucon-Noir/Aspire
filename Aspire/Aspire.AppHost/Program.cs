var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.RedirectAPI>("redirectapi");

builder.Build().Run();
