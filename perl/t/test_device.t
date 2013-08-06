use HTTP::UA::Parser;
use strict;
use Test::More;
use FindBin qw($Bin);

my $source;
my @sources = qw{
test_device.yaml
test_device_generic.yaml
};

eval {
	require($Bin . '/utils.pl');
	for $source (@sources) {
		my $yaml = get_test_yaml($source);
		my $r = HTTP::UA::Parser->new();
		foreach my $st (@{$yaml}){
				$r->parse($st->{user_agent_string});
				my $os = $r->device;
				is ($os->family, $st->{family});
		}
	}
};

if ($@){
	diag $@;
	plan skip_all => 'Couldn\'t fetch tests file ' . $source;
}

done_testing();


1;
