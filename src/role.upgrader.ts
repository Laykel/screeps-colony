import { withdrawEnergy } from './shared.logic';

export const runUpgraderRole = (creep: Creep) => {
  if (!creep.memory.recharging && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.recharging = true;
    creep.say('🔄recharge');
  }
  if (creep.memory.recharging && creep.store.getFreeCapacity() === 0) {
    creep.memory.recharging = false;
    creep.say('⚡upgrade');
  }

  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    if (
      creep.room.controller &&
      creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(creep.room.controller);
    }
  }
};
