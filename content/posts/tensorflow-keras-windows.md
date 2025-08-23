---
title: "Installing Tensorflow and Keras on Windows"
date: 2018-01-28T12:00:00Z
tags: ["tensorflow-keras-windows"]
---

Installing Tensorflow was once challenging, bordering on impossible. Now... not so much.

## Install Anaconda
[Anaconda](https://www.continuum.io/what-is-anaconda) is a data science ecosystem, giving users access to all sorts of toolkits and frameworks. [Download](https://www.continuum.io/downloads) the Anaconda installer for Windows (it's ~500MB) and install. See, that was easy!

## Install C++ Build Tools
If you don't already have them installed, you'll need to download and install the [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools).

## TF & Keras
Anaconda provides a simple tool for installing TF in a virtual environment. Open up a terminal prompt and type `conda create -n tensorflow python=3.5` . This will create a virtual environment for called tensorflow that you'll use to encapsulate all your tensorflow libraries!

[Conda Forge](https://conda-forge.org/) is a community led source for conda packages. It provides a simple way to install the packages we're looking for!

Activate your environment using `activate tensorflow`.

Now, we're going to install tf and keras into our virtual anaconda environment using packages from Conda Forge. With your tensorflow env active:
`conda install -c conda-forge keras tensorflow`

Now use `conda list` to see all packages installed in your env.

![an image](/content/images/2017/08/Capture.PNG)

Look at that! Tensorflow and Keras are both installed!

## Test

Copy the following code into a new file called kerastest.py


    from keras.models import Sequential
    from keras.layers import Dense, Dropout, Activation
    from keras.optimizers import SGD
    model = Sequential()
    model.add(Dense(64, input_dim=20, init='uniform'))
    model.add(Activation('tanh'))
    model.add(Dropout(0.5))
    model.add(Dense(64, init='uniform'))
    model.add(Activation('tanh'))
    model.add(Dropout(0.5))
    model.add(Dense(10, init='uniform'))
    model.add(Activation('softmax'))
    sgd = SGD(lr=0.1, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy',
              optimizer=sgd,
              metrics=['accuracy'])
    print('done')

If it works, then your environment is ready to go.

Get Learning!

### More Info

[Conda Environments](https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/)

[Installing TF on Windows](https://www.tensorflow.org/install/install_windows)

[Installing Keras](https://keras.io/#installation)