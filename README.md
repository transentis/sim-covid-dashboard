# BPTK Dashboard Showcase: COVID-Simulation

This is a small showcase we create to illustrate the use of our BPTK Widgets library. The BPTK Widgets library is a collection of React-Widgets that let you build dashboards for simulations created with the BPTK Framework quickly and easily.

Visit the live demo of this dashboard at [www.covid-sim.com](https://www.covid-sim.com).

## Getting Started

To fully test the dashboard, you first need to ensure the backend simulation server is running. You can find that simulation and installation instructions in the companion repository at [https://github.com/transentis/sim-covid-19](https://github.com/transentis/sim-covid-19)
Here are the steps to follow to create your BPTK Dashboard Widgets Showcase:



1. Install npm (sudo npm install -g npm) and Yarn(“sudo npm install --global yarn”)

2. Clone the repository inside your environment

    git clone https://yournamehere@bitbucket.org/transentis/bptk-widgets-showcase.git

3. Change directory: cd bptk-widgets-showcase

4. Run these two commands in that directory: “yarn install && yarn dev” (alternatively: "npm install && npm run dev "

5. Add a new file in the root folder called .env.local and add the Environment Variabel Called NEXT_PUBLIC_BACKEND_URL with your backend url

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You are now ready to explore the widgets in our library and understand how they are connected to the simulation server.
