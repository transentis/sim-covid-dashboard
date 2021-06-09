# COVID Simulation Dashboard
## BPTK Widgets showcase

This is a small showcase we create to illustrate the use of our [BPTK Widgets library](https://bptk.transentis.com). The BPTK Widgets library is a collection of React-Widgets that let you build dashboards for simulations created with the BPTK Framework quickly and easily. You can download the [BPTK Widgets Package](https://www.npmjs.com/package/@transentis/bptk-widgets) from NPM.

Visit a live version of this dashboard at [www.covid-sim.com](http://www.covid-sim.com).

## Getting Started

To fully test the dashboard, you first need to ensure the backend COVID simulation server is running. You can find the COVID simulation and installation instructions in the companion repository at [https://github.com/transentis/sim-covid-19](https://github.com/transentis/sim-covid-19).

Here are the steps to follow to run the COVID dashboard locally on your machine:

1. First you need to make sure that the COVID simulation REST API server is running on your machine - see the [companion repository](https://github.com/transentis/sim-covid-19) for instructions on how to set this up. The server should be running on [http://localhost:5000](localhost:5000).

2. Make sure you have node and yarn installed on your machine.

3. Clone this repository inside your environment

    `git clone https://git@github.com/transentis/sim-covid-dashboard.git`

4. Change directory: `cd sim-covid-dashboard`

5. Run these two commands in that directory: `yarn install && yarn build` 

6. Start the dashboard server: `yarn start`

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

You are now ready to explore the widgets in our library and understand how they are connected to the simulation server.
