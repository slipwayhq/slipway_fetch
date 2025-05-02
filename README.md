# `slipwayhq.fetch`

A [Slipway](https://slipway.co/) Component which takes multiple URLs as an input, grouped depending on the expected response type,
and returns the result of fetching those URLS as the output.

This is useful for loading data to pass into other components, without having
to write any custom code.

The URLs can be any type supported by the [Slipway Host API](https://slipway.co/docs/basics/host-api#fetch)
(for example `https://`, `file://`, `env://`, `component://`).

Response data from URLs in the `bin` group are returned encoded,
which is how other Components usually expect to receive binary data.
Components can then extract the raw binary data using the
[Slipway Host API](https://slipway.co/docs/basics/host-api#binary-encoding-and-decoding).

## Required Permissions

The component will require whatever permissions necessary to load the supplied
URLs.

For example to load `https://` URLs then some appropriate HTTP permissions will be required,
and to load `env://` URLs then appropriate environment variable permissions
will be required.

## Example Usage

Test the component by running the following command and pasting in the input when prompted:
```
slipway run-component "slipwayhq.fetch.0.5.0" --allow-http
```

Input:
```json
{
  "text": {
    "ip": "https://icanhazip.com/"
  },
  "json": {
    "todo_1": "https://jsonplaceholder.typicode.com/todos/1",
    "todo_2": "https://jsonplaceholder.typicode.com/todos/1"
  },
  "bin": {
    "ip_as_bin": "https://icanhazip.com/"
  }
}

```

Output:
```json
{
  "text": {
    "ip": {
      "body": "81.110.177.56\n",
      "ok": true,
      "status": 200
    }
  },
  "json": {
    "todo_1": {
      "body": {
        "completed": false,
        "id": 1,
        "title": "delectus aut autem",
        "userId": 1
      },
      "ok": true,
      "status": 200
    },
    "todo_2": {
      "body": {
        "completed": false,
        "id": 1,
        "title": "delectus aut autem",
        "userId": 1
      },
      "ok": true,
      "status": 200
    }
  },
  "bin_encoded": {
    "ip_as_bin": {
      "body": "ODEuMTEwLjE3Ny41Ngo=",
      "ok": true,
      "status": 200
    }
  }
}
```