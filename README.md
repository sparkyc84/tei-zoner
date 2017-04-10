# tei-zoner
## A tool for creating &lt;zone> elements within TEI.

This tool hooks together some JavaScript libraries to allow you to draw shapes on an image.  It uses the HTML5 File API to load images from a local computer using JavaScript, therefore avoiding any client-side processing and making it super-fast.

## Trying it out

A live version of the tool is available at time of writing at https://static.chrissparks.org.uk/tei

## Installation on a Server

Installation on a server is as simple as uploading index.html and the contents of the css/ and js/ folders to your server.  No server-side technologies are used, so no setup is needed.

## Running on Your Own Computer
All the processing happens locally, so you don't even need to be online to run the tool.  In many cases it will ‘just work’ through the magic of caching, but to be safe, you can download the contents of this GitHub project to your computer as a zip and open index.html in your web browser.  So long as the directory structure remains intact, it will work anywhere, no Internet connection required!

## Libraries Used
- Raphael.js for throwing shapes: https://dmitrybaranovskiy.github.io/raphael/
- Highlighter for making the generated TEI look pretty: https://highlightjs.org/
- jQuery for manipulating the DOM: http://jquery.com/

## Author
Written by Chris Sparks.  Get in touch on Twitter at @sparkyc84 or by emailing c.sparks@qmul.ac.uk with questions/comments/suggestions.

## License
The software is licensed under the MIT License.  You can do whatever you like with it so long as you include a copy of the text in the [LICENSE file](LICENSE) in this work or any work based in substantial part on it.
