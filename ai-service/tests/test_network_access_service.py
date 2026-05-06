import unittest

from app.services.security.network_access_service import is_client_ip_allowed


class NetworkAccessServiceTests(unittest.TestCase):
    def test_should_allow_ipv4_inside_cidr(self) -> None:
        self.assertTrue(is_client_ip_allowed("10.0.0.12", ["10.0.0.0/24"]))

    def test_should_block_ipv4_outside_cidr(self) -> None:
        self.assertFalse(is_client_ip_allowed("10.0.1.12", ["10.0.0.0/24"]))

    def test_should_allow_when_cidr_list_is_empty(self) -> None:
        self.assertTrue(is_client_ip_allowed("8.8.8.8", []))

    def test_should_block_invalid_client_ip(self) -> None:
        self.assertFalse(is_client_ip_allowed("testclient", ["127.0.0.1/32"]))


if __name__ == "__main__":
    unittest.main()
