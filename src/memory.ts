import { FORTIFICATION_HITS_STEP } from './constants';

export const initMemory = () => {
  Memory.startingTick = Game.time;
};

export const initRoomMemory = (room: Room) => {
  room.memory.mode = 'game_start';
  room.memory.sources = room
    .find(FIND_SOURCES)
    .map(source => ({ id: source.id } satisfies SourceMemory));

  room.memory.mainStorage = null;
  room.memory.towers = [];
  room.memory.links = [];

  room.memory.fortificationsMaxHits = FORTIFICATION_HITS_STEP;
};
