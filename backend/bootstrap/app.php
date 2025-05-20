<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        });
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found.',
            ], 404);
        });

        // $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Endpoint not found.',
        //     ], 404);
        // });

        // $exceptions->render(function (\Illuminate\Database\QueryException $e, $request) {
        //     if ($e->getCode() === '23505') {
        //         return response()->json([
        //             'success' => false,
        //             'message' => 'Duplicate entry. A record with the same value already exists.',
        //         ], 400);
        //     }

        //     return response()->json([
        //         'success' => false,
        //         'message' => 'A database error occurred.',
        //     ], 500);
        // });

        // $exceptions->render(function (Throwable $e, $request) {
        //     logger()->error("Unexpected Exception", [
        //         'exception' => $e,
        //     ]);

        //     return response()->json([
        //         'success' => false,
        //         'message' => 'An unexpected error occurred.',
        //     ], 500);
        // });
    })->create();
