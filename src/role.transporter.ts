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
