// This define a list of presences wich are discarded because of several reasons (utils -> ERROR_DICTIONARY)

class Discarded {
  constructor(command_discarded, reason_discarded) {
    this.command_discarded = command_discarded;
    this.reason_discarded = reason_discarded;
  }
}
