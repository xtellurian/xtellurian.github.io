---
title: Learning to Trade
date: 2017-11-11 11:11:11
tags: post
---

Australia's energy market has found itself in a particularly strange place. The Finkel report, released in early June, recommends legislating for a Low Emissions Target (LET) and though there are political interests for coal fired generation (CFG), CFG will inevitably decline as alternative technologies displace it. Solar power is now one of the cheapest forms of new electricity generation, and battery storage is about to burst onto the scene. All this at a time when average wholesale prices are rising sharply, and each factor contributing to a sense of price volatility. 

![NEM-WeighedAveragePrices-1](/images/learningtotrade/NEM-WeighedAveragePrices-1.jpg)

A newly emerging technology space is that of operating grid-scale battery energy storage. But operating grid-scale battery storage is a tricky business. If you've never heard of the NEM before, read [this factsheet (pdf)](https://www.aemo.com.au/-/media/Files/PDF/National-Electricity-Market-Fact-Sheet.pdf) from the Australian Energy Market Operator (AEMO). 

> All electricity sales are traded through the NEM. It is a wholesale market and prices fluctuate in response to supply and demand at any point in time.

> To manage price volatility, retailers and generators often enter into hedging contracts to fix the price for future electricity sales. -- *NEM Fact Sheet*

## Battery Strategy

#### Baseline
Imagine we're operating a battery in the NEM. Let's develop a strategy (a set of rules by which we decide whether to buy, sell, or sit) in order to maximise our profit. On the face of it, our task is simple: buy/ charge electricity when the price is low, and sell/ discharge when the price is high. As the network is currently dominated by CFG, power is usually cheap at 4am (everyone is asleep but the coal plants are still operating) and expensive at 7am and 7pm (when everyone's making breakfast or dinner, doing the washing, watching TV etc). This will be our baseline strategy to which we can compare any of our other strategies, since its trivially simply to implement. It works because there's a pattern in the market that follows our daily rhythms. However there are some major weaknesses to this approach: its vulnerable to changing patterns in the market, it can't be used in hedging contracts, and our battery might be discharged before prices spike.


#### Adapting to price

In fact, it's the last weakness I mentioned above that's the biggest problem. The NEM is a fairly transparent and competitive market, which means that many generators are operating at cost for most of the time. There are gas plants (known as peaking gas plants) that literally remain dormant most of the time, and turn on only when the price spikes and generation becomes profitable. Batteries have the same advantage as gas plants (they can turn on fast) and could also take advantage of high prices. Similarly, we'd also like to take advantage of low prices to charge our battery.

#### Augmented Baseline

An augmented baseline strategy takes into account price changes. Rather than simply charging/ discharging at particular times, we account for the difference between prices (probably running average price to minimise noise) at charge time and discharge time. If the price different is not above some threshold, then we prefer to sit (remain charged) and wait for a better price. In order to run this strategy properly, we'd need to account for the state of charge of the battery, and the self-discharge rate (ie, the rate at which energy leaks out of the battery). It's important to note that we aren't predicting any future prices, we're just comparing with the price we bought at 4am. Our expectation is that by setting our sell threshold at the correct level, we can avoid selling at a low price when we'd prefer to wait a few hours and sell later perhaps at a better price. Optimising this strategy simply requires optimising the threshold values, which must change dynamically over a day in order to encourage a complete discharge by 4am the next morning when we wish to recharge.

#### Consider the Variables
At this point, we'd do well to consider all the information we'd need to create the **perfect strategy**. Clearly we need the current price, and our current state of charge, but crucially we need *all future prices*. Knowing all future prices means we can decide whether its worth buying/ selling now so that we can buy/ sell later. The following equation expresses profit as a function of two future prices. Prices are quantised. Subscript j represents charge time and subscript i represent discharge time. Lambda represents a discount factor that prioritises earlier profit. The function can be said to represent a *full transaction* consisting of buy and sell components.

![Profit_function](/images/learningtotrade/Profit_function.gif)

Our perfect strategy would be to calcuate this function for all i,j (where i > j), sort the results and execute only those transactions with maximum profit. Note that the number of transactions executed is related to the capacity of the battery and charge/ discharge rates.

#### Predictive Strategy

We can't know for certain all future prices in the NEM, but if we can make a good *prediction* then we can get close to implementing our perfect strategy. Actually, what we really need is a probabilistic distribution of future prices. I won't go into detail here about formal decision making strategies with uncertainty, but needless to say it's an area of active research. For a gentle introduction to the subject, I recommend [Nassim Taleb's Antifragile](https://www.amazon.com/Antifragile-Things-That-Disorder-Incerto/dp/0812979680). But by weighting our perfect strategy function by probabilistic distributions, we create a strategy that will approximate the perfect strategy as long as our predictions are accurate. 

> Operating a battery in the NEM is a combination of two machine learning problems: regression and classification.

The insight here is important: with the right strategy **better prediction means bigger profits.**

At this point we can see how the baseline strategy is actually a particular subset of predictive strategy. That is, the case where we set the predictions to be a constant price minimum at 4am and a constant price maximum at 7am and 7pm, with no predictions in between.


### Enter Machine Learning
We want to predict the NEM's market prices, but this is a non-trivial problem. The number of factors influencing price is enormous. A non-exhaustive list includes the weather, events like sports games and concerts, changes to distribution and transmission, coal prices, gas prices, public holidays, and whether the people operating that power plant are having a good day. 

#### Regression
Predicting NEM prices falls under a class of problems known as *[regression](https://en.wikipedia.org/wiki/Regression_analysis)*. In simple terms, regression models the relationship between variables such that, given a number of independent variables, the value of a dependent variable is predicted. Machine learning techniques allow us to introduce literally hundreds or thousands of independent variables (usually called features) into a predictive model. We train this model with data (a training set) in a way that allows us to get extremely accurate predictions. In our context, we want to use as much relevant data as possible in order to predict prices in the NEM.

##### Experiment 
I ran a basic experiment using a Bayesian Linear Regression model in Azure Machine Learning Studio. The data used was only price data for 2016, with no other features. That is, the only data used was the date, the time, and the NEM spot price. Using the first half of 2016 as a training set, and the second half as test and validation sets, the model achieved a 99.3% coefficient of determination. Basically, the model *predicted NEM spot price extremely accurately*. This is an extremely promising result, and one that shows even simple machine learning techniques can deliver useful predictions. 

![experiment_results](/images/learningtotrade/experiment_results.jpg)

#### Classification
Operating a battery in the NEM is a combination of two machine learning problems: regression and classification. Classification is a problem in which input features define a particular class. In our case the input features are the current and future prices, and the battery state of charge, while the output classes are buy/ sell/ sit.  In our perfect strategy, we could maximise profit with zero risk because the future was perfectly deterministic and known. However, once we introduce uncertainty with our predictive strategy, the classification problem becomes more difficult. It becomes entirely possible, in fact inevitable, that our classification system makes a mistake. 

#### Learning from Mistakes
One of the huge benefits of machine learning is that we can improve them over time. Retraining models takes significantly less time than the initial training, and we expect that periodic retraining will keep a model up-to-date, as well as improve overall accuracy. 

#### Contracts
I mentioned earlier that hedging contracts are used by players in the NEM to minimise possible losses. The beauty of using machine learning to make decisions on whether to buy/ sell/ sit is that it can account for precisely those contracts. Even our predictive strategy couldn't deal with those, because it only goal was to maximise profit based on price. ML classifications systems can account for as many arbitrary independent variables as you like, and so could make decisions that account for contractual obligations or any other constraint you'd like to impose. 

In fact, another technology that may revolutionise the energy sector is [blockchain](https://hbr.org/2017/03/how-utilities-are-using-blockchain-to-modernize-the-grid). ML based battery strategies could automatically include an arbitrary number of smart contracts and have optimal decision making. Indeed, its possible for a ML decision making tool to make decisions taking many factors into account, not just profit. 

#### Anomaly Detection
Another common use of machine learning is in anomaly detection. As a subset of the clarification problem, we can use machine learning techniques to predict whether a situation is extraordinary. Anomaly detection is useful in our situation for three use cases. 

###### Detecting Anomalous Market Activity
As a battery operator (or actually any player in NEM), we'd love to know when the market might be acting 'weird'. These are the times when we stand to gain, or lose, a lot of money. Recognising these moments as early as possible might make the all the difference. 

###### Detecting Anomalous Decision Making
Assuming we'd deployed a ML tool to make buy/ sell/ sit decisions for us, we'd love to have an independent arbiter watching over those decisions and flagging any that seem strange. A supervising anomaly detection system could monitor hundreds of independent batteries and alert us if one of them starts acting strangely.

###### Detecting Anomalous Battery Operation
In what's probably the most important application of anomaly detection, we really need to know when our batteries' hardware starts acting strangely. Be it irregular state of charge, high self-discharge rates or high temperatures, there are a thousand ways for a battery to degrade and affect system performance. Machine learning lets us account for the hundreds of factors that may be early indicators of battery failure and let us act accordingly. Further, if a battery fails in an unexpected way, we can use the data collected during failure to help us predict the next failure.

#### Conclusion
Batteries will play an ever greater role in the NEM and machine learning is already here. Increasing profits generated by batteries will be driven almost entirely by improving price prediction, and the state of the art in prediction is machine learning. 