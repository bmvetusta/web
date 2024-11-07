import { OffsetActionTimer } from 'src/schema/timer/actions/offset';
import { AddRelativeActionTimer } from 'src/schema/timer/actions/relative/add';
import { GetRelativeActionTimer } from 'src/schema/timer/actions/relative/get';
import { RemoveRelativeActionTimer } from 'src/schema/timer/actions/relative/remove';
import { StartCreateActionTimer } from 'src/schema/timer/actions/start-create';
import { z } from 'zod';
import { RemoveActionTimer } from './remove';
import { SimpleActionTimer } from './simple';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

export const ActionTimer = z.union([
  StartCreateActionTimer,
  RemoveActionTimer,
  SimpleActionTimer,
  OffsetActionTimer,
  AddRelativeActionTimer,
  RemoveRelativeActionTimer,
  GetRelativeActionTimer,
]);
export type ActionTimer = z.infer<typeof ActionTimer>;
