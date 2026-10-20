<?php

namespace Tests\Feature;

use Tests\TestCase;

class RootTest extends TestCase
{
    public function test_root_returns_api_metadata(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertJson([
                'name' => 'StockPilot',
                'status' => 'ok',
            ])
            ->assertJsonStructure(['name', 'status', 'health']);
    }
}
