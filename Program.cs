// Dijodijo demo site host.
// Serves the static files from the project root (not wwwroot) so the same
// files can be published to GitHub Pages with index.html at the root.
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5080");

var app = builder.Build();

var root = app.Environment.ContentRootPath;
var files = new PhysicalFileProvider(root);

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = files,
    RequestPath = ""
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = files,
    RequestPath = ""
});

app.Run();
