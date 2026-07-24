/**
 * @fileoverview 后端接口测试占位文件
 * 后续使用 Node.js 内置 test runner 编写测试用例
 * 
 * 运行: npm test (在 apps/server 目录下)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Health API', () => {
  it('should pass placeholder test', () => {
    assert.strictEqual(1 + 1, 2);
  });
});
