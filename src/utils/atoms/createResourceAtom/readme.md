/\*\*

- You can chain this resources!
- The demo:
- https://codesandbox.io/s/reatom-resource-atom-complex-qwi3h
  \*/

Now we have next createResourceAtom signature

```ts
type FetcherFunc<P, T> = (params?: P | null) => Promise<T>;
type FetcherProcessor<T> = () => Promise<T>;
type FetcherCanceller<P> = (context: ResourceCtx<P>) => void;
type FetcherFabric<P, T> = (params?: P | null) => {
  processor: FetcherProcessor<T>;
  canceller?: FetcherCanceller<P>;
  allowCancel?: boolean;
};

export function createResourceAtom<P, T>(
  fetcher: FetcherFunc<P, T> | FetcherFabric<P, T>,
  paramsAtom?: Atom<P> | ResourceAtom<any, any> | null,
  name = `Resource-${resourceAtomIndex++}`,
  isLazy = false,
): ResourceAtomType<P, T>;
```

## Example of usage:

Case - simplest one: resource with no parameters that fetched once after created

```ts
const weatherResource = createResourceAtom<null, WeatherState>(
  () => {
    return apiClient.get<WeatherState[]>('/weather');
  },
  null,
  'weatherResource',
);
```

Case - resource with parameters: will be requested every time after weatherUnits changed

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  (weatherUnits) => {
    return apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`);
  },
  weatherUnitsAtom,
  'weatherResource',
);
```

Case - lazy resource with parameters: will be requested if have subscribers when weatherUnits changed

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  (weatherUnits) => {
    return apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`);
  },
  weatherUnitsAtom,
  'weatherResource',
  true,
);
```

Case - lazy resource that can be canceled

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  (weatherUnits) => {
    const abortController = new AbortController();

    async function processor() {
      try {
        return await apiClient.get<WeatherState[]>(
          `/weather?units=${weatherUnits}`,
          true,
          {
            signal: abortController.signal,
            errorsConfig: { dontShowErrors: true },
          },
        );
      } catch (e) {
        if (isApiError(e) && e.problem.kind === 'canceled') {
          return null;
        }
        throw e;
      }
    }

    function canceller() {
      try {
        abortController.abort();
      } catch (e) {
        console.warn('Cannot abort previous request!', e);
      }
    }

    return { processor, canceller };
  },
  weatherUnitsAtom,
  'weatherResource',
  true,
);
```

## Proposal

1. Pass dependencies as first argument.
   In complex function it's will be much easer to read

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  weatherUnitsAtom, // Now it closer to feather function arguments
  (weatherUnits) => {
    return apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`);
  },
  'weatherResource',
  true,
);
```

2. Last argument should be options object - this allow us understand what this 'true' means

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  weatherUnitsAtom,
  (weatherUnits) => {
    return apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`);
  },
  { name: 'weatherResource', lazy: true },
);
```

3. Pass abort controller to feather, for cancel request automatically.

- and remove error throwing after request aborted

```ts
const weatherResource = createResourceAtom<WeatherUnits, WeatherState>(
  weatherUnitsAtom,
  (weatherUnits, abortController) => {
     return await apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`, signal: abortController.signal);
  },
  { name: 'weatherResource', lazy: true },
);
```
