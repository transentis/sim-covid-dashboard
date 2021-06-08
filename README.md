# COVID Simulation Dashboard
## BPTK Widgets showcase

This is a small showcase we create to illustrate the use of our [BPTK Widgets library](https://bptk.transentis.com) The BPTK Widgets library is a collection of React-Widgets that let you build dashboards for simulations created with the BPTK Framework quickly and easily. You can download the [BPKTK Widgets Package](https://www.npmjs.com/package/@transentis/bptk-widgets) from NPM.

Visit a live version of this dashboard at [www.covid-sim.com](http://www.covid-sim.com).

## Getting Started

To fully test the dashboard, you first need to ensure the backend simulation server is running. You can find that simulation and installation instructions in the companion repository at [https://github.com/transentis/sim-covid-19](https://github.com/transentis/sim-covid-19).

Here are the steps to follow to run the COVID dashboard locally on your machine:

1. Install npm (sudo npm install -g npm) and Yarn(“sudo npm install --global yarn”)

2. Clone the repository inside your environment

    git clone https://git@github.com/transentis/sim-covid-dashboard.git

3. Change directory: cd sim-covid-dashboard

4. Run these two commands in that directory: “yarn install && yarn dev” (alternatively: "npm install && npm run dev "

5. Add a new file in the root folder called .env.local and add the environment variable Called NEXT_PUBLIC_BACKEND_URL with your backend url, which will most likely be [http://localhost:9000](http://localhost:9000) if you have set up the simulation server locally.

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

You are now ready to explore the widgets in our library and understand how they are connected to the simulation server.
