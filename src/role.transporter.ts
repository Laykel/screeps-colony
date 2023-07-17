import {
  firstRoomMemory,
  handleRecharging,
  pickupFromAssignedDrop,
  transferToMainStorage,
  transferToSpawn,
} from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (Memory.mode !== 'static_mining') return;

  handleRecharging(creep, 'transport');

  if (creep.memory.recharging) {
    pickupFromAssignedDrop(creep);
  } else {
    // Fill main storage if there is one
    if (firstRoomMemory().mainStorage) {
      // TODO Consider filling the spawn first if there are no operators
      transferToMainStorage(creep);
    } else {
      transferToSpawn(creep);
    }
  }
};
