export class MotionInstance {
  key: string;
  owner: string;
  title: string;
  proposal: string;
  lastCall: number;
  displayName?: string;
  status: string;
}

export const errorMotionInstance = (errorMessage: string) => {
  const errorMotion = new MotionInstance();
  errorMotion.status = errorMessage;
  return errorMotion;
}

export const formMotionInstance = (form: Partial<MotionInstance>): MotionInstance => {
  const motion = new MotionInstance();
  motion.key = form.key;
  motion.owner = form.owner;
  motion.title = form.title;
  motion.proposal = form.proposal;
  motion.lastCall = form.lastCall;
  motion.displayName = form.displayName;
  motion.status = '0';
  return Object.assign({}, motion);
}

export class FormMotionInstance extends MotionInstance {
  constructor(
      form: Partial<MotionInstance>
    ) {
      super();
      this.key = form.key;
      this.owner = form.owner;
      this.title = form.title;
      this.proposal = form.proposal;
      this.lastCall = form.lastCall;
      this.displayName = form.displayName;
      this.status = '0';
    }
}

export interface MotionAuctionItem {
  key: string;
  owner: string;
  displayName: string;
  requirement: string;
  bid: string;
  ask: string;
  deal: string | null | undefined;
}
