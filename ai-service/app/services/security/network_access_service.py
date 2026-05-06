import ipaddress


def is_client_ip_allowed(client_host: str | None, allowed_cidrs: list[str]) -> bool:
    if not allowed_cidrs:
        return True

    if not client_host:
        return False

    try:
        client_ip = ipaddress.ip_address(client_host)
    except ValueError:
        return False

    for cidr in allowed_cidrs:
        normalized_cidr = cidr.strip()
        if not normalized_cidr:
            continue
        try:
            network = ipaddress.ip_network(normalized_cidr, strict=False)
        except ValueError:
            continue
        if client_ip in network:
            return True
    return False
