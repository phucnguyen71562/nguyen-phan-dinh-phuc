interface WalletBalance {
  currency: string;
  amount: number;
  // Should add 1 more field
  blockchain: Blockchain;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

const DEFAULT_PRIORITY = -99;

// We should define a type for the blockchain so that we cannot make mistakes like adding a new blockchain out of the type of blockchain we have or misspelling it.
// Move this function outside of functional component because it doesn't depend on any property of component
const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return DEFAULT_PRIORITY;
  }
};

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // We should remove balancePriority because we don't use it anywhere
        const balancePriority = getPriority(balance.blockchain);
        // Not know where is lhsPriority, maybe it's a mistake. I think it should be balancePriority
        // Move -99 to a constant DEFAULT_PRIORITY
        if (lhsPriority > DEFAULT_PRIORITY) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    // Not depend on prices. Should remove it
  }, [balances]);

  // Should remove unused code. Reduce bundle size
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          // In my opinion, we should style wallet row inside component, we shouldn't pass it as props. If we want to change style based on some condition, we should pass that condition and do the logic in the component
          className={classes.row}
          // If we don't interact much with this wallet row (for example: delete, edit, move by dragging or something else, then using the key as an index is okay. Otherwise, we should avoid using index here, consider using a unique value)
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
