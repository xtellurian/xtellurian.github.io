# OpenAI Gym on Windows

2018-02-07


OpenAI's Gym is officially only supported on Linux and OSX. Follow these steps to get up and running on Windows using [Windows Subsystem for Linux](https://msdn.microsoft.com/en-au/commandline/wsl/install_guide)

1. Update to the latest version of Windows (>version 1607, "Anniversary Update")

2. Enable Windows Subsystem for Linux (WSL)

3. Open cmd, run `bash`

4. Install python & gym (using sudo, and NOT PIP to install gym). So by now you should probably be able to run things and get really nasty graphics related errors. This is because WSL doesn't support any displays, so we need to fake it.

5. Install vcXsrv, and run it (you should just have a little tray icon)

6. In bash `export DISPLAY=:0` 
Now when you run it you should get a display to pop-up, there may be issues related to graphics drivers. Sadly, this is where the instructions diverge if you don't have an NVIDIA graphics card.
(If you've got a nvidia graphics card) ->  
`sudo apt-get install nvidia-304 nvidia-prime`

7. Load this into test.py

        // test.py
        import gym

        if __name__ == "__main__":
        env = gym.make("SpaceInvaders-v0")
        env.reset()
        for _ in range(1000):
            env.render()
            env.step(env.action_space.sample())

8. `python test.py`

SPACE INVADERS!
![space invaders playing](/content/images/2017/08/Capture2.PNG)

My thanks to [this thread](https://github.com/openai/gym/issues/11) 