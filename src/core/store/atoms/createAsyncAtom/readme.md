## Example of usage:

#### Case - simplest one: resource with no parameters that fetched _once after created_

```ts
const weatherResource = createAsyncAtom(
  null,
  () => apiClient.get<WeatherState[]>('/weather'),
  'weatherResource',
);
```

#### Case: resource with no parameters that fetched _once_ when someone use this atom (get, getState, subscribe, useAtom)

```ts
const weatherResource = createAsyncAtom(
  null,
  () => apiClient.get<WeatherState[]>('/weather'),
  'weatherResource',
  { auto: false },
);
```

> NOTE:  
> by default `auto` is `true`  
> `auto` flags make sense only for atoms with null in dependencies (no dynamic parameters)  
> `auto: true` is the same that you call create .request() action immediately by hand after atom was created

#### Case - resource with parameters: will be requested every time after weatherUnits changed

```ts
const weatherResource = createAsyncAtom(
  weatherUnitsAtom,
  (weatherUnits) => apiClient.get<WeatherState[]>(`/weather?units=${weatherUnits}`),
  'weatherResource',
);
```

> TIP:  
> Here and in other cases you can update if by dispatching action
>
> ```ts
> dispatch(weatherResource.request({ units: 'C' }));
> // or
> dispatch(weatherResource.refetch()); // similar as request but use last request parameters
> ```

> NOTE:  
> If `weatherUnitsAtom` it's asyncAtom too, fetcher will be called only when `weatherUnitsAtom` change his `data`  
> But `weatherResource` will inherit error and loading stated from `weatherUnitsAtom`  
> That means that when `weatherUnitsAtom` start loading new data `weatherResource` change his state to loading too.  
> This behavior can be disabled by `{ inheritState: false }` option

## Case - canceling active request by new one

TODO: update this example after 12802 will be done

```ts
const weatherResource = createAsyncAtom(
  weatherUnitsAtom,
  (weatherUnits, abortController) =>
    apiClient.get<WeatherState[]>(
      `/weather?units=${weatherUnits}`,
      undefined,
      undefined,
      { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
    ),
  'weatherResource',
);
```
