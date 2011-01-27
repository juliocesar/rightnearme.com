require File.dirname(__FILE__) + '/../spec_helper'

describe Store do
  context 'a valid store' do
    subject { Store.make :empty }
    before  { subject.save }
    specify { subject.errors[:email].should_not be_empty }
  end
end