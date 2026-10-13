package main

import (
	"context"
	"time"
)

func newTimeoutContext(d time.Duration) (context.Context, func()) {
	return context.WithTimeout(context.Background(), d)
}
