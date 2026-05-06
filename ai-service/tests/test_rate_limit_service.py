import unittest

from app.services.security.rate_limit_service import allow_request, build_rate_limit_key, reset_rate_limit_state


class RateLimitServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        reset_rate_limit_state()

    def test_allow_request_memory_should_block_after_limit(self) -> None:
        key = "ip:test"
        self.assertTrue(allow_request(key=key, max_requests=1, window_seconds=60, now=100.0))
        self.assertFalse(allow_request(key=key, max_requests=1, window_seconds=60, now=101.0))

    def test_build_rate_limit_key_should_use_api_key_when_available(self) -> None:
        key_from_api = build_rate_limit_key(client_host="10.0.0.1", api_key="secret")
        key_from_api_other_ip = build_rate_limit_key(client_host="127.0.0.1", api_key="secret")

        self.assertTrue(key_from_api.startswith("api_key:"))
        self.assertEqual(key_from_api, key_from_api_other_ip)

    def test_build_rate_limit_key_should_use_ip_when_no_api_key(self) -> None:
        key_from_ip = build_rate_limit_key(client_host="10.0.0.1")
        key_from_same_ip = build_rate_limit_key(client_host="10.0.0.1")
        key_from_other_ip = build_rate_limit_key(client_host="10.0.0.2")

        self.assertTrue(key_from_ip.startswith("ip:"))
        self.assertEqual(key_from_ip, key_from_same_ip)
        self.assertNotEqual(key_from_ip, key_from_other_ip)


if __name__ == "__main__":
    unittest.main()
