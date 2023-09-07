import {
  getRoomCreepsMemoryByRole,
  handleRecharging,
  pickupFromAssignedDrop,
  transferToMainStorage,
  transferToSpawn,
} from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (creep.room.memory.mode !== 'static_mining') return;

  handleRecharging(creep, 'transport');

  if (creep.memory.recharging) {
    pickupFromAssignedDrop(creep);

    creep.memory.counter ? creep.memory.counter++ : (creep.memory.counter = 1);

    if (creep.memory.counter > 5) {
      creep.memory.counter = 0;
      creep.memory.recharging = false;
    }
    // TODO Maybe transporters could also retrieve from ruins, drops, etc. if they're not too far
    // Or maybe that's more of an operator's job...
    // const ruin = Game.getObjectById('64c77e445785ed1db743c52d' as Id<Ruin>);

    // if (ruin && creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //   creep.moveTo(ruin);
    // }
  } else {
    // Fill main storage if there is one
    if (creep.room.memory.mainStorage) {
      const operators = getRoomCreepsMemoryByRole(creep.room.name, 'operator');

      if (operators.length === 0) {
        transferToSpawn(creep);
      } else {
        transferToMainStorage(creep);
      }
    } else {
      transferToSpawn(creep);
    }
  }
};
