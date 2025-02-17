export enum EncoderTypeEnum {
  EMPLOYEE_TYPE = 'EMPLOYEE_TYPE',
  CARNET = 'CARNET',
  CARNET_ADR = 'CARNET_ADR',
  WORK_SCOPE = 'WORK_SCOPE',
  EXPERIENCE = 'EXPERIENCE',
}


export enum OfferStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED',
}

export enum ApplicationOfferStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROCESS = 'IN_PROCESS',
  REJECTED = 'REJECTED',
}

export enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  TEMPORAL = 'TEMPORAL',
}

export const fromValueSubscription = (value: string): string => {
  switch (value) {
    case SubscriptionStatusEnum.ACTIVE:
      return 'Activa';
    case SubscriptionStatusEnum.INACTIVE:
      return 'Inactiva';
    case SubscriptionStatusEnum.CANCELLED:
      return 'Cancelada';
    case SubscriptionStatusEnum.PENDING:
      return 'Pendiente';
    case SubscriptionStatusEnum.TEMPORAL:
      return 'Temporal';
    default:
      throw new Error(`Unknown value ${value}`);
  }
}


export enum TransactionStatusEnum {
  PAID = 'PAID',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export function fromValueTransaction(value: string): string {
  switch (value) {
    case TransactionStatusEnum.PAID:
      return 'Pagado';
    case TransactionStatusEnum.PENDING:
      return 'Pendiente';
    case TransactionStatusEnum.SUCCESS:
      return 'Éxito';
    case TransactionStatusEnum.FAILED:
      return 'Fallido';
    case TransactionStatusEnum.REFUNDED:
      return 'Devuelto';
    default:
      throw new Error(`Unknown value ${value}`);
  }
}

