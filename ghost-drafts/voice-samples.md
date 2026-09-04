# Voice samples -- borrowed reference voices



Not the author's own writing. Collected 2026-09-03 to set provisional targets.



## Frank Chimero, 'The Web's Grain' (frankchimero.com)



This site is an interpretation of my talk from Webstock, 2015. It is a companion to What Screens Want, a previous essay on designing natively for screens.

Can I play something for you? Trust me: it’s worth it. Oh, and while you’re listening, pay attention to your chest. You may feel a growing warmth, kind of like the fiery trickle after a shot of whiskey.

Wasn’t that great? I’ve listened to those irritating bing-bongs 30 or 40 times in the process of making this page, and while you can’t see it, I’m typing this with a big, stupid smile on my face. If you came online in the ’90s like me, you’re probably smiling too.

That sound, of course, is the audio handshake of a modem connecting to the internet. And the fiery feeling in the chest it creates is the warm pang of nostalgia. I’ve managed to tether that grating sound to all the wonder and magic I felt my first years on the internet. Back then, if you told me that I’d get to spend the next decade or so making things for the web—well, that would be just about the best news I could be told.

But things have changed, as they always do. I’m writing this fifteen years after the bing-bongs, and the fascination has faded. What happened is what always happens: the wonder I felt was diminished by experience.

There’s a quote from the French philosopher Gaston Bachelard: “We begin in admiration and end by organizing our disappointment.”

Now, this is a bit pessimistic—he is a French philosopher, after all—but right now the statement does ring true for the technology industry. Think about the weight we’ve added to the world: attention-greedy devices and services, new business structures that turn out to reinforce existing inequalities instead of working against them, technocratic blowhards, never mind the surveillance shit storm we all now must navigate.

How could any self-aware person who works in technology not start to organize their disappointment? It’s gotten to where several of my peers are floating half-hearted speculations about their next careers. This isn’t good: you want the talented and mindful people to stick around, not get husked out, then leave frustrated, exhausted, and conflicted.

The closer I get to it all, the more I become confused and overwhelmed. A thing I knew so well has reached out wider and wider, only to make less and less sense. So last year, instead of being stubborn, complaining, or feeling powerless, I went searching for a different perspective. I wanted to take something big and make it small again. This was urgent: I needed a way to re-engage with my craft on a foundational level. Otherwise, I’d also be looking for a second career.

In Buddhism, there’s something called the beginner’s mind. If you’ve ever done any kind of guided meditation, you’re probably familiar. It refers to having an attitude of openness, of eagerness. You drop your heavy preconceptions and revitalize a practice by finding a new way to look at it. Making things for the web started to feel very heavy to me, so this seemed to be what I needed.

Before I began to practice, mountains were mountains and rivers were rivers. After I began to practice, mountains were no longer mountains and rivers were no longer rivers. Now, I have practiced for some time, and mountains are again mountains, and rivers are again rivers.

So what’s the lesson? Here’s my take: we eventually work through the naive belief that profundity comes from complication. It simply isn’t so. Things have enough depth and worth on their own terms. No metaphors or analogies are needed for insight, only the willingness to listen to the subject speak for itself, even if it contradicts received wisdom.

What is there to see when you look at a website as itself? A lot, actually, but let’s simplify things down to their core. As we go through this, please excuse me for stating the obvious. My intent is to describe and document the apparent. Rivers as rivers, remember?

Here we have a very vanilla website. No styles, just markup. All defaults.

The first thing to notice about this page is that it is fluid—it adapts to the width of the viewport to fill it up. We can’t quite say it’s responsive, because responsive sites require media queries, but this site, like a responsive one, isn’t opinionated about the size of the viewport. It works well at whatever size you throw at it.

The page’s fluidity leads to the second thing to notice: the page is vertical.

Elements get stacked like a layer cake by default, and it make sense—vertical stacks are much easier to adapt across all kinds of screen sizes, because you don’t have layout issues to manage with more or less space across. You simply keep the elements the full width. This is especially handy for design methods like mobile first, since narrower screens can’t necessarily hold designs where elements are beside one another. By stacking, you get greater consistency in a design, what ever the screen size.

But not every site can be a big vertical stack of bricks, can it? What happens if you place things side-by-side?

This leads us to the primary visual challenge of responsive design. It’s the big daddy, the ur problem, the foundational thorn in your side that, for some reason, I have never seen documented.

I’m going to go back to my vanilla HTML page, but let’s add a couple lines of CSS so that our image is beside the text, and both scale in width as the viewport changes.

I’ll explain what’s happening. When I change the window width, the image gets taller as it gets wider, because its proportions are fixed. The text, on the other hand, gets shorter as it gets wider since it has no fixed proportions.

If you’ve ever designed a responsive website, this is the source of all your sadness. This is the fount of your tears, the wellspring of your suffering. If you believe in the afterlife, this is the circle of hell where they light the soles of your feet on fire.

You know how people say to add a breakpoint to a responsive design when the layout starts to look weird? This is the thing that makes the layout look weird. Every time. But, this contradiction is unavoidable and unsolvable, so the only choice is to recognize it as implicit to the medium, and devise strategies to manage it.

Most of the solidified techniques about our practice come from the natural ways of the web that have been there since the start. The answer is right there in front of us, in the website itself, and each step we take away from its intentions makes our creations weaker.

I think you make what I call “bicycle bear websites.” Why? Because my response to both is the same.

“Listen bub,” I say, “it is very impressive that you can teach a bear to ride a bicycle, and it is fascinating and novel. But perhaps it’s cruel? Because that’s not what bears are supposed to do. And look, pal, that bear will never actually be good at riding a bicycle.”

This is how I feel about so many of the fancy websites I see. “It is fascinating that you can do that, but it’s really not what a website is supposed to do.” For example, behold Apple’s Mac Pro website.

Same response as the bear on the bicycle: all glee, until things go haywire, and you realize it is coming right for you.

What is this monstrosity? Why does it feel like docking a spaceship? Why can’t I scroll? And why is there lag on my fancy laptop? What’s that sound? My computer’s fan?

Apple’s pursuit of cool yielded an incredibly fragile, willfully esoteric website that’s good for no one. And I’m certain you can think of a few similar examples of your own: clumsy sites that work counter to the inclinations of the web. Back to the zen koan—if we see the mountains as mountains and rivers as rivers, these are the sites that try to be different, yet end up swimming up stream and climbing uphill.

I believe every material has a grain, including the web. But this assumption flies in the face of our expectations for technology. Too often, the internet is cast as a wide-open, infinitely malleable material. We expect technology to help us overcome limitations, not produce more of them. In spite of those promises, we typically yield consistent design results.



## Seth Godin, seths.blog front-page posts



Of course, there’s plenty of behavioral data. Say this phrase, or offer that treat, and this particular dog is likely to act in a certain way.

But our inclinations about what it’s actually like to be a dog are all inventions, reverse-engineered to give us a clue about what they might do next.

“If I were you,” is a pretty useless sentence, particularly for dogs. You’re not them, and you can’t imagine what it’s like.

The same is true for computers and for AI. We make up a story about what the computer wants, expects or thinks. But it’s simply a way to explain our guesses about behavior, not actually a statement about what it’s like to be that device or program.

You’ve probably already guessed (there I am, imagining what it’s like to be you) that the same is true for other humans. We only know for sure what it’s like to be ourselves. Everything else is speculation.

That seems like a fair question. After tenth grade or so, it’s a choice, after all.

One honest answer is, “I have to get a good grade to get to where I want to go.” That means certification, compliance, regurgitation. It means enrollment in the outcome, not the process. When this happens, we’re seeing a failure of the system we call education. Because that’s not learning.

One answer is, “Because I’m curious.” This is a great reason to take a class, and the instructor’s job isn’t merely to satisfy the curiosity; it’s to amplify it and turn it into a habit and the practice of the autodidact.

For many professional settings, the answer might be, “To learn how to use these tools and this insight to make a change in the world after I graduate.”

That sort of enrollment becomes a productive bargain. It gives the student agency–you don’t have to like everything the instructor has to say, you don’t have to use it when you leave, but the standard is: Is it helpful to imagine having this tool in your kit, and does this course prepare you to use the tool effectively?

Teaching is expensive, so is learning. Active enrollment on both sides is part of the bargain. Students are free to reject the pedagogy, the tools, even the aims of the current practitioners of a craft. But they’re on the hook to do that after they’ve absorbed what the instructor has to offer.

Apophenia is the uniquely human tendency to perceive meaningful patterns or connections in random or unrelated data, events, or objects.

Humans are story telling machines. And one thing we do is turn co-incident events into more than coincidences.

When we see faces and shapes in clouds, apophenia wastes our time in the form of pareidolia. There isn’t actually a teddy bear in that cloud, or a face in that grilled cheese sandwich.

On the other hand, our ability to make out patterns is essential when trying to understand a system. Systems are nothing but non-coordinated conspiracies, individuals following their interests in response to a culture that is shaped by individuals following their interests.

The skill worth developing is the insight to tell them apart. Useful stories when needed, uncorrelated noise when there’s nothing actually going on.

Frederick Taylor taught Henry Ford how to do mass production. Deming brought quality, systems understanding and respect for the worker. And operations research brought insight.

1. Measure before you change. You can’t improve what you haven’t observed. Go to the floor, watch the actual work, time it, and document what’s really happening—not what you assume is happening. Taylor called this time study. Operations research calls it data collection. Either way, you start by looking.

2. Map the flow. Trace the path of materials and information from start to finish. Where does work queue up? Where does it sit idle? Where does it move backward? A simple process flow diagram reveals bottlenecks you’d never see otherwise.

3. Identify the constraint. Your system can only move as fast as its slowest step. Find it. Everything else is secondary until you address that bottleneck. (At a buffet, when you double the number of stations of the slowest item, the entire line runs faster.)

4. Separate value from waste. For every step, ask: does this transform the product in a way the customer would pay for? Anything else—waiting, moving, inspecting, reworking—is waste. You don’t need to eliminate all of it, but you need to see it.

5. Standardize the best-known method. This is Taylor’s core insight: once you find a better way, write it down, teach it, and make it the default. Not to control workers, but to create a floor that everyone can build on. Deming’s insight is that variation is the enemy of quality.

6. Reduce variation before you optimize speed. This is Deming’s most important and surprising lesson. A consistent process running at moderate speed beats an erratic one running fast. Get the process under statistical control first.

7. Build in feedback loops, not inspection gates. Smart managers don’t like end-of-line inspection because it’s too late. Instead, give the people doing the work the information and authority to catch problems as they happen. The goal is to make quality intrinsic to the process, not bolt it on after.

8. Optimize the system, not the parts. This is where operations research and Deming converge. Making one station 30% faster can actually make the whole system worse if it just piles up inventory before the next step. Ask: what does this change do to the entire flow?

9. Involve the people doing the work. Taylor got this wrong—he treated workers as interchangeable parts. Deming fixed this: the people on the floor know things management never will. Create structured ways to capture that knowledge. Invest in reducing fear so people will share what they know.

10. Iterate in small cycles. Plan-Do-Study-Act is Deming’s learning wheel. Don’t redesign everything at once. Make a small change, measure the result, learn from it, adjust. Then do it again. The factory you want isn’t built in a single leap—it emerges from dozens of small, informed improvements compounding over time.

The meta-principle underneath all ten: respect the system and the people in it. Change the system before you blame the people.

And don’t get efficient at doing something you’d rather not be doing at all.

The first day of classes, some students slouch in the back row, unprepared and uninterested. Some are up front, eager and ready. But it’s only the morning of the first day–these attitudes aren’t related to the teacher. It’s a pattern, one that is the result of culture, systems and personality.

Many of these students have been let down before, and it’s easier to be skeptical than to make a commitment, only to be disappointed later.

If it happens over time, it becomes part of how we see ourselves. And that person might end up in a job where they seek to do as little as possible and care less.

how much can I contribute, what can I learn, how do I make this count?

dread, ennui and a desire to do as little as possible.

For a great job or a committed teacher, it’s a shame if someone brings a failure attitude to work. They’re wasting a slot that someone else could have thrived in.

And for a lousy job, one that offers little dignity or possibility, we’re wasting all the potential of someone who seeks to contribute.

Getting the match right helps the organization and the worker as well.

Resumes give few clues about the attitude people bring to work. But finding the right match could save a lot of time and heartbreak.

In the blue square, the right attitude meets the right job and magic ensues. In the green square, the assembly line moves on, and someone with a fearful attitude finds the job they can live with and dislike.The other two quadrants are tragic mismatches, where people and organizations are both disappointed.

A set of German-made socket wrenches can turn a bolt in a similar way to a cheaper alternative, but it feels far more rewarding.

More than forty years ago, I started using a Mac. The first thing one noticed was hard to put words on–everything about it simply clicked better. The mouse was an extension of your mind.

Today, a 128k Mac is an ancient relic, and the current models have raised the standard. The other day, I needed to use a cheap PC laptop, and the difference was startling. I felt like I was wearing gloves.



## Julie Zhuo, The Looking Glass (lg.substack.com), 2 essays



Thoughtfully choosing the scope such that things are built on time, on budget, and at a high level of quality.

When “Let's be innovative!” wins at the expense of “Let's do things effectively and quickly!”

Focus on the competition, and you won't take the risks necessary to make it big.

Ignore the competition, and you'll miss plausible threats until it's too late.

Be optimistic, but paranoid.6:50 AM · Jun 17, 2021117 Reposts · 677 LikesHow To Become A Way Better Design CritiquerHint: fewer off-the-cuff opinions; more questions. Julie Zhuo@jouleeEveryone has an opinion on design.

There's always an immediate gut reaction: "Ooh, I love this!" or "Meh."

But how do you go beyond that to honing your skills of giving helpful, actionable feedback?

Here are the 7 questions I run through when critiquing a product's design 👇5:24 AM · Jun 24, 2021497 Reposts · 2.45K LikesHow To Become A Way Better Metrics CritiquerI consider this really really important and it’s something I wish more product builders paid close attention to, even those who don’t consider themselves data people (*ahem* many designers).Julie Zhuo@jouleeSomeone on your team says: “Our goal should be to move Metric X up Y% this half.”

Your inclination is to nod, say “Cool” and get on with the actual building.

The goals you agree to determine what you build. So consider them carefully.



## Julie Zhuo, The Looking Glass (lg.substack.com), 2 essays



