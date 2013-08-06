#!/usr/bin/perl -w

my @sources = qw/
device_generic_feature_phone.txt
device_generic_smartphone.txt
device_spider.txt
/;

my $dest = "test_device_generic.yaml";

$test = <<EOS;
test_cases:

EOS

my $FH;


for my $source (@sources) {
	if (! -f $source) {
		print STDERR "ERROR: File $source not found!\n";
		next;
	}
	open ($FH, $source) or die "ERROR: Could not read from file $source !\n";
	my @data = <$FH>;
	close ($FH);

	for $line (@data) {
		my ($family, $user_agent_string) = split(/\t/, $line);
		chomp($user_agent_string);
		$test .= <<EOS;
  - user_agent_string: '$user_agent_string'
    family: '$family'
EOS
	}
}

open ($FH, ">$dest") or die "ERROR: Could not write to $dest !";
print $FH $test;
close($FH);
