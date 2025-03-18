---
title: Blogging with Blazor and Cloudflare
date: 2023-12-13 11:11:00
tags: post
---

# Blogging with Blazor & Cloudflare

[Blazor](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor) is a dotnet/ C# based web app framework. It promises that you'll be able to **"build full stack web apps without writing a line of JavaScript."** At time of writing, this post is hosted on a Blazor frontend application. While building the blogging engine, I discovered that Blazor is cool, it runs on [Cloudflare Pages](https://pages.cloudflare.com), it's a good dev experience, but it's no substitute for JavaScript (yet).

## Getting started

I decided to use a Blazor WASM project for this site, because I wanted to run it on Cloudflare pages. Pages are awesome because they run on Cloudflare's edge network, AND they come for free. Unfortunately, while Cloudflare does offer a "server-side" environment (called Cloudflare Workers), they only support a Javascript runtime. For full-stack Blazor (including server-side rendering) a different hosting service might be required.

I created this app using dotnet 7:

```sh

# check dotnet version
dotnet --version
7.0.401

dotnet new blazorwasm -o edge
...
```

Out of the box, this creates a Blazor WASM project with some example components.

## Rendering markdown

Since I was porting several existing posts, I wanted to keep using markdown as a simple storage format for all my writing. Therefore, I needed a markdown to HTML renderer. I'd usually use a pre-built library in this situation, and I quickly discovered that there are many more Javascript implementations than dotnet. Furthermore, WASM applicatons **cannot manipulate the DOM** ([source](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts#)), which makes client side markdown rendering essentially impossible using only C#.

I decided to expose the raw markdown via GET request, and then render to HTML using [Showdown JS](https://showdownjs.com) and Blazor's JS Interop functionality.

```js
// Post.razor.js
export async function setInnerHtmlFromRequest(id, url) {
  const converter = new showdown.Converter(); 
  const content = await fetch(url);
  const text = await content.text();
  const html = converter.makeHtml(text);
  document.getElementById(id).innerHTML = html;
}
```

```cs
// Post.razor
// other implementation omitted
private async Task LoadPost()
{
    var path = $"/posts/{PostId}.md";
    // reference a Javascript module from Blazor
    var module = await JS.InvokeAsync<IJSObjectReference>("import", "./Pages/Post.razor.js");
    // call a function in the module
    await module.InvokeVoidAsync("setInnerHtmlFromRequest", ContentId, path);
}
```

While this works, it has several downsides:

* Lack of type safety on Blazor/JS interop calls and responses.
* I now need to support Javascript in the project
* Small performance hit on interop call
* Harder to migrate to server-side rendering

## Running on Cloudflare Pages

Cloudflare have some [good documentation](https://developers.cloudflare.com/pages/framework-guides/deploy-a-blazor-site/) on how to deploy a Blazor site using Pages. It's quite simple, but the downsides are:
* cloudflare build agent doesn't have dotnet installed, which increases the build time. My simple project takes ~10 minutes to build on Cloudflare.
* Cloudflare doesn't support server-side C# and so there's no server side rendering
* No server-side rendering also means no fallback for browsers that don't support WASM.


What I get for free with Cloudflare is:
* Free web hosting
* Edge deployments close to the consumer
* [Preview deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/)

So as with all engineering challenges, building a blog site with Blazor WASM and Cloudflare has pro's and con's. It's probably better to just statically render your blogs at build time, but where's the fun in that?

[Check out the code here](https://github.com/xtellurian/xtellurian.github.io/)