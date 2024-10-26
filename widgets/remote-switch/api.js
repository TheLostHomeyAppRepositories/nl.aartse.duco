'use strict';

module.exports = {
  async updateBoxState({ homey, params, body }) {
    homey.log('received update-box-state from widget');
    
    homey.app.updateBoxState(body.state);
  },
  async getBoxState({ homey, params }) {
    homey.log('received get-box-state from widget');
    
    return homey.app.getBoxState();
  },
};
