package com.facebook.react.bridge;

import android.os.AsyncTask;

/**
 * Compatibility shim for libraries that still depend on GuardedResultAsyncTask,
 * which was removed from newer React Native versions. This mirrors the old
 * behavior by invoking guarded background work and guarded post-execute on
 * the main thread while routing exceptions to the JSExceptionHandler.
 */
public abstract class GuardedResultAsyncTask<Result> extends AsyncTask<Void, Void, Result> {
  private final JSExceptionHandler exceptionHandler;

  public GuardedResultAsyncTask(JSExceptionHandler exceptionHandler) {
    this.exceptionHandler = exceptionHandler;
  }

  @Override
  protected final Result doInBackground(Void... params) {
    try {
      return doInBackgroundGuarded();
    } catch (RuntimeException e) {
      exceptionHandler.handleException(e);
      throw e;
    }
  }

  @Override
  protected final void onPostExecute(Result result) {
    try {
      onPostExecuteGuarded(result);
    } catch (RuntimeException e) {
      exceptionHandler.handleException(e);
      throw e;
    }
  }

  protected abstract Result doInBackgroundGuarded();

  protected void onPostExecuteGuarded(Result result) {}
}

