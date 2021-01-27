import Knex from 'knex';

import { RecordDoesNotExist } from '@cumulus/errors';

import { tableNames } from '../tables';

import { isRecordDefined } from '../database';

class BasePgModel<ItemType, RecordType extends { cumulus_id: number }> {
  readonly tableName: tableNames;

  constructor({
    tableName,
  }: {
    tableName: tableNames,
  }) {
    this.tableName = tableName;
  }

  async get(
    knexOrTransaction: Knex | Knex.Transaction,
    params: Partial<RecordType>
  ) {
    const record = await knexOrTransaction<RecordType>(this.tableName)
      .where(params)
      .first();

    if (!isRecordDefined(record)) {
      throw new RecordDoesNotExist(`Record in ${this.tableName} with identifiers ${JSON.stringify(params)} does not exist.`);
    }

    return record;
  }

  async getRecordCumulusId(
    knexOrTransaction: Knex | Knex.Transaction,
    whereClause : Partial<RecordType>
  ): Promise<number> {
    const record: RecordType = await knexOrTransaction(this.tableName)
      .select('cumulus_id')
      .where(whereClause)
      .first();
    if (!isRecordDefined(record)) {
      throw new RecordDoesNotExist(`Record in ${this.tableName} with identifiers ${JSON.stringify(whereClause)} does not exist.`);
    }
    return record.cumulus_id;
  }

  async exists(
    knexOrTransaction: Knex | Knex.Transaction,
    params: Partial<RecordType>
  ): Promise<boolean> {
    const record = await knexOrTransaction<RecordType>(this.tableName)
      .where(params)
      .first();

    return isRecordDefined(record);
  }

  create(
    knexOrTransaction: Knex | Knex.Transaction,
    item: ItemType
  ) {
    return knexOrTransaction(this.tableName)
      .insert(item)
      .returning('cumulus_id');
  }

  delete(
    knexOrTransaction: Knex | Knex.Transaction,
    params: Partial<RecordType>
  ) {
    return knexOrTransaction(this.tableName)
      .where(params)
      .del();
  }
}

export { BasePgModel };
