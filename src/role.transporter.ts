import {
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

    // TODO Maybe transporters could also retrieve from ruins, drops, etc. if they're not too far
    // Or maybe that's more of an operator's job...
    // const ruin = Game.getObjectById('64c77e445785ed1db743c52d' as Id<Ruin>);

    // if (ruin && creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //   creep.moveTo(ruin);
    // }
  } else {
    // Fill main storage if there is one
    if (creep.room.memory.mainStorage) {
      // TODO Consider filling the spawn first if there are no operators
      transferToMainStorage(creep);
    } else {
      transferToSpawn(creep);
    }
  }
};
