
class RlEnv {
  constructor() {
// agent parameter spec to play with (this gets eval()'d on Agent reset)
    const spec = {};
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.01; // value function learning rate
    spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 20;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100; // number of neurons in hidden layer
    const env = {};
    env.getNumStates = () => 5;
    env.getMaxNumActions = () => 3;

    this.spec = spec;
    this.env = env;
  }
}

module.exports = RlEnv;
