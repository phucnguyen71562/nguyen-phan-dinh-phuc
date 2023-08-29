import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LOADING_TIME = 500;

interface TOKEN_PRICES {
  currency: string;
  date: string;
  price: number;
  image: string;
}

const formSchema = z.object({
  input_currency: z.string(),
  input_amount: z
    .string()
    .or(z.number())
    .transform((v) => Number(v)),
  output_currency: z.string(),
  output_amount: z
    .string()
    .or(z.number())
    .transform((v) => Number(v)),
});

type FormData = z.infer<typeof formSchema>;

function App() {
  const [data, setData] = useState<TOKEN_PRICES[]>([]);
  const [error, setError] = useState('');
  const [currencyError, setCurrencyError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then((res) => {
        if (!res.ok) return setError('Unable to fetch data');

        return res.json();
      })
      .then((data: TOKEN_PRICES[]) =>
        setData(
          [...new Map(data.map((item) => [item.currency, item])).values()].map(
            (d) => ({
              ...d,
              image: `assets/${d.currency}.svg`,
            })
          )
        )
      )
      .catch(() => setError('Unable to fetch data'));
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input_currency: '',
      input_amount: 0,
      output_currency: '',
      output_amount: 0,
    },
  });

  const onSubmit = (values: FormData) => {
    if (!values.input_currency || !values.output_currency) {
      setCurrencyError('Please choose input and output currency');
      return;
    } else {
      setCurrencyError('');
    }

    setLoading(true);

    const input_price = data.find((i) => i.currency === values.input_currency);
    const output_price = data.find(
      (i) => i.currency === values.output_currency
    );

    if (input_price && output_price) {
      setTimeout(() => {
        form.setValue(
          'output_amount',
          values.input_amount * (input_price.price / output_price.price)
        );
        setLoading(false);
      }, LOADING_TIME);
    }
  };

  if (error) {
    return (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {error}
      </h4>
    );
  }

  return (
    <>
      {!!currencyError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{currencyError}</AlertDescription>
        </Alert>
      )}
      <div className="grid place-items-center mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="w-[800px]">
              <CardHeader>
                <CardTitle>Swap</CardTitle>
              </CardHeader>

              <CardContent className="flex">
                <div className="flex flex-col space-y-3 flex-1">
                  <Label>Amount to send</Label>
                  <div className="flex items-end space-x-2">
                    <FormField
                      control={form.control}
                      name="input_currency"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data.map((item) => (
                                <SelectItem value={item.currency}>
                                  <div className="flex items-center">
                                    <img
                                      src={item.image}
                                      alt=""
                                      className="w-full object-cover mr-1"
                                    />
                                    {item.currency}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="input_amount"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <RefreshCw className="w-[70px] flex self-center" />

                <div className="flex flex-col space-y-3 flex-1">
                  <Label>Amount to receive</Label>
                  <div className="flex items-end space-x-2">
                    <FormField
                      control={form.control}
                      name="output_currency"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data.map((item) => (
                                <SelectItem
                                  key={item.price}
                                  value={item.currency}
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={item.image}
                                      alt=""
                                      className="w-full object-cover mr-1"
                                    />
                                    {item.currency}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="output_amount"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              readOnly
                              type="number"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button disabled={loading} type="submit">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  CONFIRM SWAP
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}

export default App;
