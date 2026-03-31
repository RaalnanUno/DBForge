# I'm getting an error on the fd.Write line.

Found invalid data while decoding

```c#

using(stream fd = File.Create(FilePaths.PDFConversionPath + "Decomp_" + fileName))
using(Stream fs = File.OpenRead(fileFulPath))
using(Stream csStream = new GZipStream(fs, CompressionMode.Decompress))
{

byte[] buffer = new byte[1024];
int nRead;
while((nRead = csStream.Read(buffer, 0, buffer.Length))>0)
{
	fd.Write(buffer,0,nRead);
}

}


```

It works on my local machine, but when I deploy it to the QA server, it doesn't.