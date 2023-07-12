import { handleRecharging, withdrawEnergy } from './shared.logic';

export const runUpgraderRole = (creep: Creep) => {
  handleRecharging(creep, 'upgrade');

  if (creep.memory.recharging) {
    // TODO Currently too dependent on room layout, will need to check closest container OR dropped resources with at least 100
    // if (Memory.mode === 'static_mining') {
    //   pickupFromAssignedDrop(creep);
    // } else {
    withdrawEnergy(creep);
    // }
  } else {
    if (
      creep.room.controller &&
      creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(creep.room.controller);
    }
  }
};
