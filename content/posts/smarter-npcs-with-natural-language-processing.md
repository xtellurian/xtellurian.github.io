---
title: "Smarter NPCs with Natural Language Processing"
date: 2018-05-23T13:53:49Z
tags: ["gaming", "nlp", "ai", "npcs"]
categories: ["technical"]
---

## What happened in Pokemon?

I remember Pokemon on GameBoy. An excellent game with many characters. Like all games (till now - more on that soon) the conversations were somewhat forced. The most creative moment was choosing your name in the beginning. Almost all my interactions with non-player chracters (NPC) involved multiple choice answers at best, and pre-canned conversations at worst.

![Screenshot of a simple Yes or No answer to a question in Pokemon for Gameboy](/images/NLU/Pokemonconversationscreenshot.png)

## Games have Evolved

A decade after Pokemon was first released on Gameboy, Fallout 3 was one of the most popular games in the world. For all its quality graphics and cool story, the NPC interations remain remarkably unchanged.

![Screenshot from Fallout 3 showing multiple choice answers](/images/NLU/fallout3multiplechoice.jpg)

## We have the technology. We can do better

What if you could actually talk to NPCs? Well, now you can!

### What is Natural Language Understanding?

> the application of computational techniques to the analysis and synthesis of natural language and speech.

NLU, sometimes called Natural Language Processing (NLP), are methods for processing and using natural human speech or text in classical algorithms. Recent technological breakthroughs in Deep Learning have turbocharged NLU, and now you can use it in your own game or application.

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1420_RC05/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"deep learning","geo":"","time":"today 5-y"}],"category":0,"property":""}, {"exploreQuery":"date=today%205-y&q=deep%20learning","guestPath":"https://trends.google.com:443/trends/embed/"}); </script> 

### Sounds hard...

Not really, check this out.

LUIS - the Language Understanding and Intelligence Service from Microsoft Azure - is super simple to use. You can follow [this tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-create-app) and get started in just 10 minutes!


Aside: if you're in Australia, make sure you head to the au.luis.ai domain.

### What's LUIS - the quick version

LUIS is a web service, invoked via a REST endpoint, that converts sentences (called 'utterances') like this:

`Order me 2 pizzas`

into data structures like this:

```js
{
   "query": "Order me 2 pizzas",
   "topScoringIntent": {
       "intent": "FoodOrder",
       "score": 0.9999981
   },
   "intents": [
       {
           "intent": "FoodOrder",
           "score": 0.9999981
       },
       {
           "intent": "None",
           "score": 0.0604290478
       },
       {
           "intent": "Reminder",
           "score": 0.00177723425
       }
   ],
   "entities": [
       {
           "entity": "2",
           "type": "builtin.number",
           "startIndex": 9,
           "endIndex": 9,
           "resolution": {
               "value": "2"
           }
       },
       {
           "entity": "pizzas",
           "type": "FoodType",
           "startIndex": 11,
           "endIndex": 16,
           "score": 0.8928091
       }
   ]
}
```

If you're making a game or an app, and you can make web requests, then you can have NPCs that respond to natural language!

## Now for the good part

Modern games are much more sophisticated than Gameboy Pokemon and Fallout 3. Cutting edge games are now in virtual reality (VR) on platforms like [Vive](https://www.vive.com/), [Oculus](https://www.oculus.com/), and [Windows Mixed Reality](https://www.microsoft.com/en-au/windows/windows-mixed-reality). But we're starting to use VR for other interesting applications.

### Experience a New Language in VR with V-KAIWA

[V-KAIWA](http://www.v-kaiwa.com/en/home/) are building an amazing tool for students to experience language learning in VR. Beyond building stylised worlds and engaging story lines, V-KAIWA are building customisable conversational NPCs. Let's break that down.

#### Conversational NPCs

As the name suggests, a conversational NPC is a character with which you can converse. OK, so they aren't going to pass a [Turing test](https://en.wikipedia.org/wiki/Turing_test), but they can respond to natural language. Ask the hot dog vendor on the street for a hot dog, and you'll get one! Ask a stranger for directions, and they'll help! But if you ask a stranger for the meaning of life - of course you'll get a silly answer (actually that's kind of realistic).

#### Customisable NPCs

V-KAIWA let's language teachers customise the way their students can converse with NPCs. How does this work in practice? Imagine a language class on recognising descriptions of people and objects. The teacher can describe a person (a woman in a jacket) and name an item (a newspaper) and the students must complete a scenario in the virtual world. The teacher can build precisely that conversation scenario in V-KAIWA's designer tool!

![Creating an NPC interaction definition in the V-KAIWA interaction designer](/images/NLU/vkaiwadesigner.gif)

When the student find the newspaper, he can talk with the woman.

> *Student*: Here's the newspaper you asked for.
> *Woman in Jacket*: Thanks, I was looking for one of those.

It's almost too easy.


#### Sugar on top

By using speech-to-text and speech synthesis tools, V-KAIWA make every NPC interaction aural. You can speak directly to NPCs, and they speak back. LUIS means you can speak naturally. [Gaze](https://docs.microsoft.com/en-us/windows/mixed-reality/gaze-targeting) means you speak to the NPC you're looking at.

![System design of V-KAIWAs customisable conversational NPCs](/images/NLU/vkaiwaarchitecture.png)


### I want that!

Well you can have it! There's a great blog written by some of my collegues at [Road to MR](http://www.roadtomr.com/2018/05/08/2508/natural-language-for-simulations/) describing how to use LUIS in your Unity project. They've created a great Unity Package you can use to get started quickly. 

What about the designer? It's also open source and [available on github](https://github.com/xtellurian/v-kaiwa-designer)

## CSE Hacks

This work was a collaboration between Microsoft and V-KAIWA. Big thanks to them for letting me work on their exciting product.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Seiya presenting at <a href="https://twitter.com/Microsoft?ref_src=twsrc%5Etfw">@Microsoft</a> <a href="https://twitter.com/Microsoft?ref_src=twsrc%5Etfw">@microsoft</a> Mixed Reality Hackfest - our beginners product did a complete 180 (in a good way!) - full demo video coming soon 😉 <br><br>And special props <a href="https://twitter.com/xtellurian?ref_src=twsrc%5Etfw">@xtellurian</a> for being part of V-KAIWA for the week 🤓 <a href="https://t.co/bmhUpQItKC">pic.twitter.com/bmhUpQItKC</a></p>&mdash; V-KAIWA (@v_kaiwa) <a href="https://twitter.com/v_kaiwa/status/997417548852310017?ref_src=twsrc%5Etfw">May 18, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>