import { Box, Skeleton, Stack } from "@mantine/core";

function FlightSkeleton() {
  return (
    <Box>
      <Skeleton height={12} width={160} radius="sm" mb={8} />
      <Skeleton height={20} width={220} radius="sm" mb={6} />
      <Skeleton height={12} width={100} radius="sm" />
    </Box>
  );
}

export default function FlightListSkeleton() {
  return (
    <Box maw={640} mx="auto" p="md">
      <Stack gap="xl">
        {Array.from({ length: 11 }).map((_, i) => (
          <FlightSkeleton key={i} />
        ))}
      </Stack>
    </Box>
  );
}
