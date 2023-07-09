type Mode = 'container';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder';

interface Memory {
  mode?: Mode;
}

interface CreepMemory {
  role: CreepRole;
  building?: boolean;
  upgrading?: boolean;
}

// interface FlagMemory {}
// interface SpawnMemory {}
// interface RoomMemory {}
